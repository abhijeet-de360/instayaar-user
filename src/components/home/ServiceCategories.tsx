import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


export const ServiceCategories = () => {
  const navigate = useNavigate();
  const categoryVar = useSelector((state: RootState) => state.category)

  const handleServiceClick = (serviceName: string) => {
    navigate(`/discover?service=${encodeURIComponent(serviceName)}`);
  };

  const handleViewAllClick = () => {
    navigate('/discover');
  };

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

      {/* Desktop Layout - Grid without scroll */}
      <div className="hidden md:grid grid-cols-4 gap-6 mb-8">
        {categoryVar.categoryData.slice(6).map((data, index) =>
        (<Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden " onClick={() => handleServiceClick(data._id)}>
          <CardContent className="p-0 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={data.image} alt={data.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-3 bg-black">
              <h3 className="text-white font-semibold text-sm text-center">
                {data.name}
              </h3>
            </div>
          </CardContent>
        </Card>
        ))}
      </div>

      {/* Mobile Layout - 2x4 Grid */}
      <div className="md:hidden">
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
          )
        )}
        </div>
      </div>

      {/* View All Button */}
      {/* <div className="text-center mt-8">
        <Button variant="outline" size="lg" onClick={handleViewAllClick}>
          View All Services
        </Button>
      </div> */}
    </div>
  </section>;
};