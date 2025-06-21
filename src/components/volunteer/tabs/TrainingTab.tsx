
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Play, CheckCircle, Clock, Star, Users, FileText } from "lucide-react";

const TrainingTab = () => {
  const trainingModules = [
    {
      id: 1,
      title: "Basic First Aid",
      description: "Essential first aid techniques for emergency situations",
      duration: "2 hours",
      difficulty: "Beginner",
      progress: 100,
      status: "completed",
      certificate: true,
      rating: 4.8,
      students: 1234
    },
    {
      id: 2,
      title: "Disaster Response Protocols",
      description: "Standard procedures for different types of disasters",
      duration: "3 hours",
      difficulty: "Intermediate",
      progress: 65,
      status: "in-progress",
      certificate: false,
      rating: 4.9,
      students: 987
    },
    {
      id: 3,
      title: "Communication Guidelines",
      description: "Effective communication during crisis situations",
      duration: "1.5 hours",
      difficulty: "Beginner",
      progress: 0,
      status: "not-started",
      certificate: false,
      rating: 4.7,
      students: 756
    },
    {
      id: 4,
      title: "Safety Procedures",
      description: "Personal safety and risk assessment in emergency zones",
      duration: "2.5 hours",
      difficulty: "Intermediate",
      progress: 0,
      status: "recommended",
      certificate: true,
      rating: 4.9,
      students: 654
    },
    {
      id: 5,
      title: "Equipment Usage",
      description: "Proper usage of emergency response equipment",
      duration: "1 hour",
      difficulty: "Beginner",
      progress: 0,
      status: "not-started",
      certificate: false,
      rating: 4.6,
      students: 432
    },
    {
      id: 6,
      title: "Advanced Medical Response",
      description: "Advanced techniques for medical emergencies",
      duration: "4 hours",
      difficulty: "Advanced",
      progress: 0,
      status: "locked",
      certificate: true,
      rating: 4.9,
      students: 234
    }
  ];

  const certificates = [
    {
      id: 1,
      title: "Basic First Aid Certification",
      issueDate: "March 15, 2024",
      expiryDate: "March 15, 2025",
      status: "active"
    },
    {
      id: 2,
      title: "Emergency Response Certification",
      issueDate: "February 28, 2024",
      expiryDate: "February 28, 2025",
      status: "active"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'recommended': return 'bg-orange-100 text-orange-700';
      case 'locked': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">2</div>
              <div className="text-sm text-gray-600">Completed Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">1</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">2</div>
              <div className="text-sm text-gray-600">Certificates Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">7.5</div>
              <div className="text-sm text-gray-600">Hours Trained</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Modules */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span>Training Modules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingModules.map((module) => (
              <Card key={module.id} className={`border-2 transition-all duration-300 hover:shadow-lg ${
                module.status === 'completed' ? 'border-green-200 bg-green-50' :
                module.status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                module.status === 'recommended' ? 'border-orange-200 bg-orange-50' :
                module.status === 'locked' ? 'border-gray-200 bg-gray-50 opacity-60' :
                'border-gray-200 hover:border-blue-200'
              }`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                      </div>
                      {module.certificate && (
                        <Award className="h-5 w-5 text-yellow-600 ml-2" />
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{module.duration}</span>
                      </div>
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{module.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{module.students} students</span>
                      </div>
                    </div>

                    {module.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {module.status === 'completed' ? (
                        <Button className="flex-1 bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      ) : module.status === 'in-progress' ? (
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      ) : module.status === 'locked' ? (
                        <Button className="flex-1" disabled>
                          🔒 Locked
                        </Button>
                      ) : (
                        <Button className="flex-1" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Start Course
                        </Button>
                      )}
                      {module.status !== 'locked' && (
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-yellow-600" />
            <span>Your Certificates</span>
            <Badge variant="outline">{certificates.length} Earned</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <Card key={cert.id} className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{cert.title}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Issued: {cert.issueDate}</p>
                        <p>Expires: {cert.expiryDate}</p>
                      </div>
                      <Badge className="mt-2 bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      Download PDF
                    </Button>
                    <Button size="sm" variant="outline">
                      Verify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add more certificates placeholder */}
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-4 flex items-center justify-center text-center">
                <div>
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Complete more courses to earn certificates</p>
                  <Button className="mt-2" size="sm" variant="outline">
                    Browse Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Learning Path */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-6 w-6 text-purple-600" />
            <span>Recommended Learning Path</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Based on your mission history and current skills, we recommend completing these courses next:
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-purple-100 text-purple-700 px-3 py-1">
                🩺 Advanced Medical Response
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 px-3 py-1">
                🔧 Equipment Usage
              </Badge>
              <Badge className="bg-orange-100 text-orange-700 px-3 py-1">
                📢 Communication Guidelines
              </Badge>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Start Recommended Path
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingTab;
