import os
import time
import io
import numpy as np
from PIL import Image
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

load_dotenv(os.path.join(SCRIPT_DIR, ".env"))
hf_token = os.getenv("HF_TOKEN")

if not hf_token:
    print("Erreur : HF_TOKEN non trouvé dans le fichier .env")
    exit(1)

# Use sayeed99/segformer_b3_clothes as it is more reliable and available
MODEL_ID = "sayeed99/segformer_b3_clothes"
client = InferenceClient(token=hf_token)

# Exact color palette based on user reference image
COLOR_PALETTE = {
    "Background": (0, 0, 0),       # Black (Implicitly used for unclassified pixels)
    "Hat": (255, 255, 0),          # Yellow
    "Hair": (255, 165, 0),         # Orange
    "Sunglasses": (255, 0, 255),   # Magenta
    "Upper-clothes": (255, 0, 0),  # Red
    "Skirt": (0, 255, 255),        # Cyan
    "Pants": (0, 255, 0),          # Green
    "Dress": (0, 0, 255),          # Blue
    "Belt": (128, 0, 128),         # Purple
    "Left-shoe": (255, 255, 0),    # Yellow
    "Right-shoe": (0, 191, 255),   # Light Blue (DeepSkyBlue)
    "Face": (173, 216, 230),       # Light Blue (Addressed as Visage in ref)
    "Left-leg": (176, 196, 222),   # Light Steel Blue
    "Right-leg": (176, 196, 222),  # Light Steel Blue
    "Left-arm": (176, 196, 222),   # Light Steel Blue
    "Right-arm": (176, 196, 222),  # Light Steel Blue
    "Bag": (255, 140, 0),          # Dark Orange
    "Scarf": (148, 0, 211)          # Dark Violet
}

def segment_clothing(image_path):
    """
    Envoie l'image à l'API Hugging Face et retourne une carte sémantique colorée ainsi que les étiquettes détectées.
    """
    try:
        print(f"Envoi de la requête pour {os.path.basename(image_path)} au modèle {MODEL_ID}...")
        
        segments = client.image_segmentation(image_path, model=MODEL_ID)
        
        if not isinstance(segments, list):
            print("Erreur : Format de réponse inattendu (pas une liste)")
            return None, []

        if not segments:
            print("Aucun segment détecté.")
            return None, []
            
        first_mask = segments[0]['mask']
        width, height = first_mask.size
        
        final_image_arr = np.zeros((height, width, 3), dtype=np.uint8)
        detected_labels = []

        for segment in segments:
            label = segment.get('label')
            detected_labels.append(label)
            color = COLOR_PALETTE.get(label)
            
            if color:
                mask = segment['mask']
                mask_arr = np.array(mask)
                indices = mask_arr > 0
                final_image_arr[indices] = color

        return Image.fromarray(final_image_arr), list(set(detected_labels))
                    
    except Exception as e:
        print(f"Erreur lors du traitement de {image_path} : {e}")
        return None, []

def main(process_all=False, specific_images=None):
    input_dir = os.path.join(SCRIPT_DIR, "imgs", "IMG")
    output_dir = os.path.join(SCRIPT_DIR, "imgs", "Mask")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    images = [f for f in os.listdir(input_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    if not images:
        print(f"Aucune image trouvée dans {input_dir}")
        return
    
    if specific_images:
        to_process = specific_images
    else:
        to_process = images if process_all else [images[0]]
    
    print(f"Début du traitement de {len(to_process)} image(s)...")
    
    for img_name in to_process:
        img_path = os.path.join(input_dir, img_name)
        print(f"Traitement de {img_name}...")
        
        result, labels = segment_clothing(img_path)
        
        if result:
            output_path = os.path.join(output_dir, f"mask_{os.path.splitext(img_name)[0]}.png")
            result.save(output_path)
            print(f"Masque sauvegardé : {output_path}")
            print(f"Étiquettes détectées : {', '.join(labels)}")
        else:
            print(f"Échec du traitement pour {img_name}")

if __name__ == "__main__":
    main(process_all=False)
