import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";


export const ServiceCategories = () => {
  const navigate = useNavigate();
  const categoryVar = useSelector((state: RootState) => state.category)

  const handleServiceClick = (serviceName: string) => {
    navigate(`/discover?service=${encodeURIComponent(serviceName)}`);
  };
  const MobileSkeleton = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-none shadow-none">
          <CardContent className="p-0 flex flex-col">
            <Skeleton className="h-40 w-full rounded-b-none animate-shimmer" />
            <div className="bg-muted/5 p-3">
              <Skeleton className="h-4 w-2/3 animate-shimmer mx-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  return <section className=" pt-4 md:py-12">
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center mb-8 hidden md:block">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Browse Popular Services
        </h2>
        <p className="text-muted-foreground">
          Find the perfect service for your needs
        </p>
      </div>
      <div className="md:hidden">
        {categoryVar.isLoading ? <MobileSkeleton /> : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categoryVar.categoryData.slice(0, 8).map((item, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden" onClick={() => handleServiceClick(item._id)}>
                <CardContent className="p-0 flex flex-col">
                  <div className="h-40 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="bg-gradient-to-br to-primary from-secondary-foreground p-2">
                    <h3 className="text-white font-semibold text-xs text-center">
                      {item.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))
          }
          </div>
        )}
      </div>
    </div>
  </section>;
};