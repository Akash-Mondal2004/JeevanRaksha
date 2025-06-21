
import { Button } from "@/components/ui/button";
import { Heart, Home, Users, AlertTriangle } from "lucide-react";

interface EmergencyTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const EmergencyTypeSelector = ({ selectedType, onTypeSelect }: EmergencyTypeSelectorProps) => {
  const emergencyTypes = [
    {
      id: "medical",
      label: "Medical Emergency",
      icon: Heart,
      color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
      selectedColor: "bg-red-500 text-white border-red-500"
    },
    {
      id: "food-water",
      label: "Food/Water Crisis",
      icon: Users,
      color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
      selectedColor: "bg-blue-500 text-white border-blue-500"
    },
    {
      id: "shelter",
      label: "Shelter Needed",
      icon: Home,
      color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
      selectedColor: "bg-green-500 text-white border-green-500"
    },
    {
      id: "evacuation",
      label: "Evacuation Help",
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
      selectedColor: "bg-orange-500 text-white border-orange-500"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Select Emergency Type</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {emergencyTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Button
              key={type.id}
              variant="outline"
              className={`p-4 h-auto flex flex-col items-center space-y-2 transition-all duration-200 ${
                isSelected ? type.selectedColor : type.color
              }`}
              onClick={() => onTypeSelect(type.id)}
            >
              <IconComponent className="h-6 w-6" />
              <span className="text-sm font-medium text-center leading-tight">
                {type.label}
              </span>
            </Button>
          );
        })}
      </div>
      
      {selectedType && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 max-w-md mx-auto">
          <p className="text-blue-800 text-sm font-medium">
            Ready to send {emergencyTypes.find(t => t.id === selectedType)?.label.toLowerCase()} alert
          </p>
        </div>
      )}
    </div>
  );
};

export default EmergencyTypeSelector;
