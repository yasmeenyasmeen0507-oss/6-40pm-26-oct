import { useNavigate, useLocation, useParams } from "react-router-dom";
import PickupScheduler from "@/components/sell-flow/PickupScheduler";
import { useEffect, useState } from "react";
import { CheckCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlowState } from "@/pages/Index";

const PickupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [flowState, setFlowState] = useState<FlowState | null>(null);
  
  // Check if we're on the success path
  const isSuccess = location.pathname.endsWith('/success');

  useEffect(() => {
    // Get flowState from sessionStorage
    const storedFlowState = sessionStorage.getItem('flowState');
    
    if (!storedFlowState) {
      // If no data found, redirect to home
      navigate("/");
      return;
    }

    try {
      const parsedFlowState = JSON.parse(storedFlowState);
      setFlowState(parsedFlowState);
    } catch (error) {
      console.error("Error parsing flowState:", error);
      navigate("/");
    }
  }, [navigate]);

  // Listen for custom event from PickupScheduler when pickup is successfully scheduled
  useEffect(() => {
    const handlePickupSuccess = () => {
      // Update URL to show success (but stay on same page)
      const currentPath = location.pathname;
      const successPath = currentPath.endsWith('/pickup') 
        ? `${currentPath}/success` 
        : currentPath;
      
      if (!currentPath.endsWith('/success')) {
        navigate(successPath, { replace: true });
      }
    };

    // Listen for the event
    window.addEventListener('pickupScheduled', handlePickupSuccess);

    return () => {
      window.removeEventListener('pickupScheduled', handlePickupSuccess);
    };
  }, [location.pathname, navigate]);

  const handleGoHome = () => {
    // Clear sessionStorage
    sessionStorage.removeItem("flowState");
    navigate("/");
  };

  if (!flowState) {
    return null;
  }

  // Show success message if on success path
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Pickup Scheduled Successfully!</CardTitle>
              <CardDescription>
                Your device pickup has been scheduled. We'll contact you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Device</p>
                  <p className="font-semibold">{flowState.deviceName} - {flowState.storageGb}GB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Final Price</p>
                  <p className="text-2xl font-bold text-primary">₹{flowState.finalPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Number</p>
                  <p className="font-semibold">{flowState.phoneNumber}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> Our team will contact you within 24 hours to confirm the pickup details.
                </p>
              </div>
              
              <Button 
                onClick={handleGoHome} 
                className="w-full"
                size="lg"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show pickup form
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <PickupScheduler flowState={flowState} />
      </main>
    </div>
  );
};

export default PickupPage;