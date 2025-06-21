
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, User, Phone, MapPin, Heart, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VolunteerRegistrationProps {
  onClose: () => void;
}

const VolunteerRegistration = ({ onClose }: VolunteerRegistrationProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    skills: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const availableSkills = [
    { id: "medical", label: "Medical Aid", icon: Heart },
    { id: "rescue", label: "Rescue Operations", icon: Shield },
    { id: "logistics", label: "Logistics", icon: Users },
    { id: "communication", label: "Communication", icon: Phone },
  ];

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(s => s !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Registration Successful!",
      description: "Welcome to the Jevan Raksha volunteer network. You'll receive notifications when help is needed nearby.",
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <CardTitle className="text-2xl text-blue-900">Join as Volunteer</CardTitle>
          <CardDescription>
            Help save lives during disasters. Register to be part of our volunteer network.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone Number</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Skills & Expertise</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableSkills.map((skill) => {
                  const IconComponent = skill.icon;
                  const isSelected = formData.skills.includes(skill.id);
                  
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleSkillToggle(skill.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-xs font-medium text-center leading-tight">
                        {skill.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                By registering, you agree to receive emergency notifications and help coordinate relief efforts in your area.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register as Volunteer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerRegistration;
