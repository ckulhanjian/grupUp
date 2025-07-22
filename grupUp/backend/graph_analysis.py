import networkx as nx
import matplotlib.pyplot as plt
import json
import os
from itertools import combinations
from datetime import datetime

# Updated Python script optimized for auto-generation

def load_user_data(json_file_path):
    """Load user data from the JSON file created by your Node.js backend"""
    try:
        with open(json_file_path, 'r') as f:
            data = json.load(f)
        
        # Convert list of submissions to dict with user identifiers
        users = {}
        for i, submission in enumerate(data):
            # Use userId if available, otherwise create one
            user_id = submission.get('name', f"user_{i+1}")
            users[user_id] = submission
        return users
    except FileNotFoundError:
        print(f"File {json_file_path} not found.")
        return {}
    except json.JSONDecodeError:
        print("Error decoding JSON file.")
        return {}

# Define your survey schema - UPDATE THIS to match your actual form
survey_schema = {
    "name": {"type": "text", "weight": 0},  # not used in matching
    "hobbies": {"type": "multi-select", "weight": 2},
    "intention_out": {"type": "multi-select", "weight": 2},
    "intention_by_event": {"type": "mode-group", "weight": 3},
    "money": {"type": "similar", "weight": 1},
    "transportation": {"type": "similar", "weight": 1},
    "diet": {"type": "multi-select", "weight": 1},
    "social_battery": {"type": "similar", "weight": 2},
    "stress": {"type": "similar", "weight": 2},
    "traits": {
        "Work Ethic": {"type": "similar", "weight": 2},
        "Fitness": {"type": "similar", "weight": 2},
        "Social": {"type": "exact", "weight": 2}
    },
    "fun_facts": {"type": "text", "weight": 0},  # optional/ignored for matching
    "timestamp": {"type": "timestamp", "weight": 0}  # ignored for matching
}

def compare_multi_select(list1, list2):
    """Compare two lists/arrays for multi-select questions"""
    set1 = set(list1) if list1 else set()
    set2 = set(list2) if list2 else set()
    
    if not set1 and not set2:
        return 100.0
    if not set1 or not set2:
        return 0.0
    overlap = len(set1 & set2)
    total = len(set1 | set2)
    return round((overlap / total) * 100, 2)

def directional_match_mode_group(userA, userB, field):
    """Handle the complex mode-group structure"""
    field_data_a = userA.get(field, {})
    field_data_b = userB.get(field, {})
    
    if not field_data_a or not field_data_b:
        return 0.0
    
    total_score = 0
    total_comparisons = 0
    
    # Get common events
    common_events = set(field_data_a.keys()) & set(field_data_b.keys())
    
    for event in common_events:
        event_a = field_data_a[event]
        event_b = field_data_b[event]
        
        if 'self' in event_a and 'expected' in event_b and 'self' in event_b and 'expected' in event_a:
            # A's self satisfies B's expectations
            a_self = set(event_a.get('self', []))
            b_expected = set(event_b.get('expected', []))
            a_to_b = len(a_self & b_expected) / max(len(b_expected), 1) if b_expected else 0
            
            # B's self satisfies A's expectations
            b_self = set(event_b.get('self', []))
            a_expected = set(event_a.get('expected', []))
            b_to_a = len(b_self & a_expected) / max(len(a_expected), 1) if a_expected else 0
            
            total_score += (a_to_b + b_to_a) / 2
            total_comparisons += 1
    
    return round((total_score / total_comparisons) * 100, 2) if total_comparisons else 0.0

def calculate_match_score(u1, u2, schema):
    """Calculate compatibility score between two users"""
    actual = 0
    total = 0

    for q_id, meta in schema.items():
        if 'type' in meta:
            if q_id not in u1 or q_id not in u2: # error
                continue

            q_type = meta['type']
            weight = meta['weight']
        else:
            for nested_id, nested_meta in meta.items():
                if nested_id not in u1 or nested_id not in u2:
                    continue 
                q_type = nested_meta['type']
                weight = nested_meta['weight']

        try:
            if q_type == 'multi-select':
                score = compare_multi_select(u1[q_id], u2[q_id])
                max_score = 100
            elif q_type == 'similar':
                # Convert to numbers for comparison
                val1 = float(u1[q_id]) if isinstance(u1[q_id], (str, int, float)) else 0
                val2 = float(u2[q_id]) if isinstance(u2[q_id], (str, int, float)) else 0
                score = 5 - abs(val1 - val2)
                max_score = 5
            elif q_type == 'complementary':
                val1 = float(u1[q_id]) if isinstance(u1[q_id], (str, int, float)) else 0
                val2 = float(u2[q_id]) if isinstance(u2[q_id], (str, int, float)) else 0
                score = abs(val1 - val2)
                max_score = 5
            elif q_type == 'mode-group':
                score = directional_match_mode_group(u1, u2, q_id)
                max_score = 100
            else:
                continue

            actual += score * weight
            total += max_score * weight
            
        except (ValueError, TypeError) as e:
            print(f"Error processing {q_id}: {e}")
            continue

    return round((actual / total) * 100, 2) if total else 0.0

def create_compatibility_graph(json_file_path, save_image=True):
    """Main function to create the compatibility graph"""
    
    # Load data
    users = load_user_data(json_file_path)
    
    print(f"Loaded {len(users)} users")
    
    if len(users) < 2:
        print(f"Need at least 2 users to create connections. Found {len(users)} users.")
        return None
    
    # Build graph
    G = nx.Graph()
    
    # Add nodes
    for user in users:
        G.add_node(user)
    
    # Calculate all matches
    matches = []
    all_scores = []
    
    for u1, u2 in combinations(users.keys(), 2):
        score = calculate_match_score(users[u1], users[u2], survey_schema)
        all_scores.append(score)
        
        if score >= 50:  # Threshold for creating edge
            G.add_edge(u1, u2, weight=score)
            matches.append((u1, u2, score))
    
    # Print results
    print(f"\nCompatibility Analysis Results:")
    print(f"Total possible pairs: {len(all_scores)}")
    print(f"Average compatibility: {sum(all_scores)/len(all_scores):.1f}%")
    print(f"Matches ≥50%: {len(matches)}")
    
    if matches:
        matches.sort(key=lambda x: x[2], reverse=True)  # Sort by score
        print(f"\nTop matches:")
        for u1, u2, score in matches[:5]:  # Show top 5
            print(f"  {u1} ↔ {u2}: {score:.1f}%")
    
    # Create visualization
    if save_image and len(matches) > 0:
        plt.figure(figsize=(12, 8))
        pos = nx.spring_layout(G, seed=42, k=3, iterations=50)
        
        # Draw nodes
        nx.draw_networkx_nodes(G, pos, node_color='lightblue', 
                              node_size=1500, alpha=0.9)
        
        # Draw edges with thickness based on score
        edges = G.edges(data=True)
        for u, v, data in edges:
            weight = data['weight']
            width = max(1, weight / 25)  # Scale line width
            color = 'green' if weight >= 80 else 'orange' if weight >= 65 else 'red'
            nx.draw_networkx_edges(G, pos, [(u, v)], width=width, 
                                 edge_color=color, alpha=0.7)
        
        # Add labels
        nx.draw_networkx_labels(G, pos, font_size=10, font_weight='bold')
        
        # Add edge labels for high scores
        high_score_edges = {(u, v): f"{data['weight']:.0f}%" 
                           for u, v, data in G.edges(data=True) 
                           if data['weight'] >= 70}
        nx.draw_networkx_edge_labels(G, pos, high_score_edges, font_size=8)
        
        plt.title(f"User Compatibility Graph\n{len(matches)} matches ≥50% • Generated {datetime.now().strftime('%H:%M')}")
        plt.axis('off')
        plt.tight_layout()
        
        # Save the image
        image_path = '../public/graph.png'
        plt.savefig(image_path, dpi=150, bbox_inches='tight')
        print(f"\nGraph saved as {image_path}")
        
        # Show the plot (comment out if running headless)
        # plt.show()
        # plt.close()
    
    return G

if __name__ == "__main__":
    # Path to your data.json file
    json_path = "data.json"
    
    # Create the graph
    graph = create_compatibility_graph(json_path, save_image=True)