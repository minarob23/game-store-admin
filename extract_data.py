import csv

with open('attached_assets/vgsales.csv', 'r') as f:
    reader = csv.reader(f)
    next(reader)  # Skip header
    
    genres = set()
    platforms = set()
    
    for row in reader:
        if len(row) >= 5:  # Make sure row has enough columns
            genres.add(row[4])
        if len(row) >= 3:  # Make sure row has enough columns
            platforms.add(row[2])
    
    print("Unique Genres:")
    print(sorted(genres))
    print("\nUnique Platforms:")
    print(sorted(platforms))