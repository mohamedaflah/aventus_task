export const generateFakeProducts = (count: number) => {
    const brands = ["Apple", "Samsung", "Sony", "Dell", "HP"];
    const categories = ["Mobile", "Laptop", "Headphones"];
  
    const products: any[] = [];
  
    for (let i = 1; i <= count; i++) {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
  
      products.push({
        title: `${brand} ${category} Model ${i}`,
        description: `This is a ${brand} ${category} with great features and performance`,
        category,
        brand,
        price: Math.floor(Math.random() * 1000) + 100,
      });
    }
  
    return products;
  }