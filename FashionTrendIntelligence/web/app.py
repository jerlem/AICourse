import os
import sys
from flask import Flask, render_template, jsonify, send_from_directory

# Add parent directory to sys.path to import SegformerClothes
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import SegformerClothes

app = Flask(__name__)

# Base directory for the project
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(PROJECT_ROOT, "imgs", "IMG")
MASK_DIR = os.path.join(PROJECT_ROOT, "imgs", "Mask")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/images')
def list_images():
    try:
        images = [f for f in os.listdir(IMG_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        return jsonify(images)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/process/<image_name>')
def process_image(image_name):
    try:
        if image_name == "all":
            # Optimization: process all images
            images = [f for f in os.listdir(IMG_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
            SegformerClothes.main(process_all=True)
            return jsonify({"status": "success", "processed_count": len(images)})
            
        # Construct the output mask name
        mask_name = f"mask_{os.path.splitext(image_name)[0]}.png"
        img_path = os.path.join(IMG_DIR, image_name)
        
        # Call segment_clothing directly to get labels
        result, labels = SegformerClothes.segment_clothing(img_path)
        
        if result:
            mask_path = os.path.join(MASK_DIR, mask_name)
            result.save(mask_path)
            # Filter labels to remove Background
            labels = [l for l in labels if l != "Background"]
            return jsonify({
                "status": "success", 
                "mask": mask_name,
                "labels": labels
            })
        else:
            return jsonify({"status": "error", "message": "Failed to generate mask"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/imgs/<path:filename>')
def serve_img(filename):
    return send_from_directory(IMG_DIR, filename)

@app.route('/masks/<path:filename>')
def serve_mask(filename):
    return send_from_directory(MASK_DIR, filename)

@app.route('/api/analyze-all')
def analyze_all():
    try:
        images = [f for f in os.listdir(IMG_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        # In a real scenario, we might want to cache these results or run them in parallel
        # For now, let's process them or use existing masks if we were to store labels
        # Since we don't store labels yet, let's process a few for the demo or all if small
        
        all_labels = []
        # Limit to first 10 for performance in this demo, or all if requested
        to_process = images[:15] 
        
        for img_name in to_process:
            img_path = os.path.join(IMG_DIR, img_name)
            _, labels = SegformerClothes.segment_clothing(img_path)
            all_labels.extend(labels)
            
        # Count frequencies
        from collections import Counter
        counts = Counter(all_labels)
        
        # Remove non-clothing items from trends
        excluded = ["Background", "Face", "Hair", "Left-arm", "Right-arm", "Left-leg", "Right-leg"]
        for label in excluded:
            if label in counts:
                del counts[label]
            
        return jsonify({
            "status": "success", 
            "total_images": len(to_process),
            "trends": dict(counts)
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Ensure Mask directory exists
    if not os.path.exists(MASK_DIR):
        os.makedirs(MASK_DIR)
    app.run(debug=True, port=5000)
