import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProductsPage = () => {
    return (
        <div className="p-5 border border-red-500 rounded-xl">
            <h1>Products Page</h1>
            <Button>Add to Cart</Button>
            <Input placeholder="Search products..." />
        </div>
    );
}

export default ProductsPage;