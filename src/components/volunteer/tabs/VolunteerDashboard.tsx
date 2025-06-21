import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActiveEmergencies from "./ActiveEmergencies";
import MyMissions from "./MyMissionsTab";

const VolunteerDashboard = () => {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Emergency Requests</TabsTrigger>
          <TabsTrigger value="missions">My Missions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <ActiveEmergencies />
        </TabsContent>
        
        <TabsContent value="missions">
          <MyMissions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerDashboard;