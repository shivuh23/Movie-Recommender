import pandas as pd
import numpy as np
import json
import os
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def convert(obj):
    L = []
    for i in ast.literal_eval(obj):
        L.append(i['name'])
    return L

def process_data():
    csv_path = "src/data/tmdb_5000_movies.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return

    print("Loading dataset...")
    df = pd.read_csv(csv_path)

    # 1. Select relevant columns
    # We need: id, title, genres, keywords, overview
    df = df[['id', 'title', 'genres', 'keywords', 'overview']]

    # 2. Preprocessing
    print("Preprocessing data...")
    df.dropna(inplace=True)

    # Handle JSON-like strings in columns
    df['genres'] = df['genres'].apply(convert)
    df['keywords'] = df['keywords'].apply(convert)
    
    # Process overview (convert to list of words)
    df['overview'] = df['overview'].apply(lambda x: x.split())

    # Cleaning spaces in names (e.g., 'Science Fiction' -> 'ScienceFiction')
    df['genres'] = df['genres'].apply(lambda x: [i.replace(" ", "") for i in x])
    df['keywords'] = df['keywords'].apply(lambda x: [i.replace(" ", "") for i in x])

    # Create 'tags' column
    df['tags'] = df['overview'] + df['genres'] + df['keywords']
    
    # Back to string for vectorization
    df['tags'] = df['tags'].apply(lambda x: " ".join(x))
    df['tags'] = df['tags'].apply(lambda x: x.lower())

    # 3. Vectorization & Similarity
    print(f"Vectorizing {len(df)} movies...")
    tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
    tfidf_matrix = tfidf.fit_transform(df['tags'])

    print("Calculating similarity matrix...")
    similarity = cosine_similarity(tfidf_matrix)

    # 4. Create Recommendation Mapping
    print("Generating recommendation mapping...")
    recommendations = {}
    
    # To avoid huge JSON files, we'll only store top 6 recommendations per movie
    for idx, row in df.iterrows():
        # Get index in the matrix (which corresponds to row index since we dropped NAs)
        # However, it's safer to use a relative index
        rel_idx = df.index.get_loc(idx)
        
        distances = sorted(list(enumerate(similarity[rel_idx])), reverse=True, key=lambda x: x[1])
        top_indices = [i[0] for i in distances[1:7]] # Top 6 recommendations
        
        rec_list = []
        for i in top_indices:
            rec_list.append({
                "title": df.iloc[i].title,
                "genre": ", ".join(df.iloc[i].genres)
            })
        
        recommendations[row['title']] = rec_list

    # 5. Export Data
    output_dir = "src/data"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print(f"Exporting data to {output_dir}...")
    
    # Export full movie list for search (reduced size for frontend performance)
    movie_list = []
    for idx, row in df.iterrows():
        movie_list.append({
            "id": int(row['id']),
            "title": row['title'],
            "genre": ", ".join(row['genres']),
            "overview": " ".join(row['overview'][:30]) + "..." # Truncate overview for frontend
        })

    with open(os.path.join(output_dir, 'movie_data.json'), 'w') as f:
        json.dump(movie_list, f, indent=2)

    # Export recommendations mapping
    with open(os.path.join(output_dir, 'recommendations.json'), 'w') as f:
        json.dump(recommendations, f, indent=2)

    print(f"Successfully processed {len(df)} movies.")

if __name__ == "__main__":
    process_data()
