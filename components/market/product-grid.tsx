import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Premium Rice",
    description: "50kg bag of high-quality rice",
    price: 45000,
    image: "/rice.jpg",
    category: "Foodstuff",
    inStock: true,
    discount: 10,
  },
  {
    id: 2,
    name: "Brown Beans",
    description: "100kg sack of brown beans",
    price: 85000,
    image: "/beans.jpg",
    category: "Foodstuff",
    inStock: true,
  },
  {
    id: 3,
    name: "Maize Seeds",
    description: "10kg of hybrid maize seeds",
    price: 25000,
    image: "/maize-seeds.jpg",
    category: "Seeds",
    inStock: true,
  },
  {
    id: 4,
    name: "White Garri",
    description: "50kg bag of white garri",
    price: 35000,
    image: "/garri.jpg",
    category: "Foodstuff",
    inStock: true,
    discount: 5,
  },
  {
    id: 5,
    name: "Yam Tubers",
    description: "Large yam tubers (10 pieces)",
    price: 55000,
    image: "/yam-tubers.jpg",
    category: "Tubers",
    inStock: true,
  },
  {
    id: 6,
    name: "Cassava Stems",
    description: "Bundle of cassava stems for planting",
    price: 40000,
    image: "/cassava-stems.jpg",
    category: "Cash Crops",
    inStock: false,
  },
];

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden group hover:shadow-xl transition-shadow"
        >
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover bg-muted group-hover:scale-105 transition-transform"
            />
            {product.discount && (
              <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                -{product.discount}%
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 left-3 bg-card/80 backdrop-blur-sm hover:bg-card"
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-5 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-foreground">
                  {product.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                {product.discount ? (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground line-through">
                      ₦{product.price.toLocaleString()}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      ₦
                      {(
                        (product.price * (100 - product.discount)) /
                        100
                      ).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl font-bold text-foreground">
                    ₦{product.price.toLocaleString()}
                  </p>
                )}
              </div>
              <Button disabled={!product.inStock} className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                {product.inStock ? "Buy" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
