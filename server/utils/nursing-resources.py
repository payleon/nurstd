import trafilatura
import json
import os
from typing import List, Dict, Any

# Sources for high-quality nursing education resources
RESOURCE_SOURCES = {
    "med-surg": [
        "https://www.registerednursing.org/nclex/medical-surgical-nursing/",
        "https://nurseslabs.com/medical-surgical-nursing/"
    ],
    "pediatrics": [
        "https://www.registerednursing.org/nclex/pediatric-nursing/",
        "https://nurseslabs.com/pediatric-nursing/"
    ],
    "obstetrics": [
        "https://www.registerednursing.org/nclex/maternal-newborn-nursing/",
        "https://nurseslabs.com/maternity-newborn-nursing/"
    ],
    "psych": [
        "https://www.registerednursing.org/nclex/psychiatric-mental-health-nursing/",
        "https://nurseslabs.com/psychiatric-nursing/"
    ],
    "pharmacology": [
        "https://www.registerednursing.org/nclex/pharmacological-parenteral-therapies/",
        "https://nurseslabs.com/pharmacology/"
    ],
    "fundamentals": [
        "https://www.registerednursing.org/nclex/fundamentals-of-nursing/",
        "https://nurseslabs.com/nursing-notes/"
    ],
    "critical-care": [
        "https://www.registerednursing.org/nclex/reduction-risk-potential/",
        "https://nurseslabs.com/critical-care-nursing/"
    ],
    "emergency": [
        "https://www.registerednursing.org/nclex/physiological-adaptation/",
        "https://nurseslabs.com/emergency-nursing/"
    ]
}

# Resource types
RESOURCE_TYPES = [
    "article", 
    "video", 
    "quiz", 
    "practice", 
    "flashcard", 
    "interactive"
]

def extract_resources_from_url(url: str) -> List[Dict[str, Any]]:
    """Extract potential resources from a URL"""
    try:
        # Download the content
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            return []
            
        # Extract text content
        text = trafilatura.extract(downloaded, output_format='xml', include_links=True)
        if not text:
            return []
            
        # Parse the XML to find links
        import xml.etree.ElementTree as ET
        root = ET.fromstring(text)
        
        resources = []
        
        # Extract links
        for a in root.findall('.//link'):
            href = a.get('href', '')
            if not href or href.startswith('#') or 'mailto:' in href:
                continue
                
            title = a.text or 'Nursing Resource'
            
            # Clean up the title
            title = title.strip()
            if not title or len(title) < 5:
                continue
                
            # Create resource entry
            if 'quiz' in href.lower() or 'test' in href.lower():
                resource_type = 'quiz'
            elif 'video' in href.lower() or 'youtube' in href.lower():
                resource_type = 'video'
            elif 'flashcard' in href.lower():
                resource_type = 'flashcard'
            elif 'interactive' in href.lower() or 'practice' in href.lower():
                resource_type = 'interactive'
            else:
                resource_type = 'article'
                
            resources.append({
                'title': title,
                'url': href,
                'resourceType': resource_type,
                'description': f"Learn about {title.lower()}",
                'source': url,
                'estimatedTime': 30  # Default time in minutes
            })
            
        return resources
    except Exception as e:
        print(f"Error extracting resources from {url}: {e}")
        return []

def get_resources_for_category(category: str) -> List[Dict[str, Any]]:
    """Get resources for a specific nursing category"""
    resources = []
    urls = RESOURCE_SOURCES.get(category, [])
    
    for url in urls:
        resources.extend(extract_resources_from_url(url))
        
    # Limit to reasonable number
    return resources[:20]

def generate_all_resources():
    """Generate resources for all categories and save to JSON"""
    all_resources = {}
    
    for category in RESOURCE_SOURCES:
        print(f"Extracting resources for {category}...")
        all_resources[category] = get_resources_for_category(category)
        
    # Save to file
    output_path = os.path.join(os.path.dirname(__file__), "nursing_resources.json")
    with open(output_path, 'w') as f:
        json.dump(all_resources, f, indent=2)
        
    print(f"Resources saved to {output_path}")
    
if __name__ == "__main__":
    generate_all_resources()