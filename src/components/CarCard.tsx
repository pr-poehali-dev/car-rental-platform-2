
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface CarCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  priceUnit: string;
  category: string;
  features: string[];
}

const CarCard = ({ id, title, image, price, priceUnit, category, features }: CarCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="outline">{category}</Badge>
        </div>
        <CardDescription className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{price.toLocaleString('ru-RU')}</span>
          <span className="text-sm text-muted-foreground">₽/{priceUnit}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Link to={`/car/${id}`} className="flex-1">
          <Button variant="default" className="w-full">
            Подробнее
          </Button>
        </Link>
        <Button variant="outline" size="icon">
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
