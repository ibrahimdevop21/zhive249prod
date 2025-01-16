#!/bin/bash

# Install webp if not already installed
if ! command -v cwebp &> /dev/null
then
    echo "cwebp could not be found, installing..."
    sudo apt-get install webp
fi

# Function to optimize images
optimize_image() {
    local file=$1
    local output_dir=$2
    
    # Get file extension
    extension="${file##*.}"
    
    # Create output path
    base_name=$(basename "$file" ".$extension")
    output_file="$output_dir/$base_name.webp"
    
    # Convert to WebP
    cwebp -q 80 "$file" -o "$output_file"
    
    # Compare file sizes
    original_size=$(stat -c%s "$file")
    new_size=$(stat -c%s "$output_file")
    
    # Keep the smaller file
    if [ "$new_size" -lt "$original_size" ]; then
        echo "Optimized: $file -> $output_file (saved $((original_size - new_size)) bytes)"
        rm "$file"
    else
        echo "No optimization needed for $file"
        rm "$output_file"
    fi
}

# Create optimized directory
optimized_dir="public/optimized"
mkdir -p "$optimized_dir"

# Find and optimize all images
find public -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) | while read -r file; do
    optimize_image "$file" "$optimized_dir"
done

echo "Image optimization complete!"
