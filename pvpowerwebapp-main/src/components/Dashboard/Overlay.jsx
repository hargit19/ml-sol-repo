import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Dashboard/Overlay.css';
import { useAuth } from '../../context/AuthProvider';
import { getPaymentFlow } from '../../api/paymentFlow';

const Overlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [overlayText, setOverlayText] = useState('Welcome to the dashboard! Click on the map to set a location or search for a specific place.');
  const [daysRemaining, setDaysRemaining] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkConditions = async () => {
      try {
        const result = await getPaymentFlow(user._id);
        console.log(result);
        
        if (result.status !== "success") {
          setOverlayText("Something went wrong. Please try again.");
          return;
        }

        const userPayment = result.data.userPayment;
        const modelLimit = userPayment.currentPlanId.plan_run_limit_per_day;
        const userModelRuns = userPayment.userId.modelRuns;
        const modelDuration = userPayment.currentPlanId.plan_duration;
        const endDate = new Date(userPayment.planExpiryDate);
        const currentDate = new Date();

        const diffInMs = endDate - currentDate;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        // Store days remaining for use in handleClose
        setDaysRemaining(diffInDays);
        
        setPaymentData(result.data);
        if(diffInDays <= 0){
            setOverlayText(`Your plan has expired. Please click the button below to visit the Pricing page.`);
        } else {
            setOverlayText(`Greetings User, Your plan will expire in ${diffInDays} days.`);
        }
        
      } catch (error) {
        console.error("Error checking conditions:", error);
        setOverlayText("Error loading payment information. Please try again later.");
      }
    };
    
    checkConditions();
    
    // Set the body to non-scrollable when overlay is visible
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [user._id]);

  const handleClose = () => {
    if (daysRemaining === null) {
      // If we don't have the days remaining value yet or there was an error, just close the overlay
      setIsVisible(false);
    } else if (daysRemaining > 0) {
      // If days remaining is positive, just close the overlay
      setIsVisible(false);
    } else {
      // If days remaining is zero or negative, navigate to pricing page
      navigate('/pricing');
    }
  };

  const handleCloserenew = () => {
    navigate('/pricing');
  }

  if (!isVisible) {
    return null;
  }

  // Change button text based on days remaining
  const buttonText = daysRemaining !== null && daysRemaining <= 0 ? 'Go to Pricing' : 'Close';

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-text">
          {overlayText}
        </div>
        <div className="overlay-btns">
  <button className="overlay-close-btn" onClick={handleClose}>
    {buttonText}
  </button>
  <button className="overlay-close-btn" onClick={handleCloserenew}>
    Renew Now
  </button>
</div>

      </div>
    </div>
  );
};

export default Overlay;