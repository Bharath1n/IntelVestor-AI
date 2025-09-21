import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Header from './pages/components/Header';
import Footer from './pages/components/Footer';
import Home from './pages/Home';
import Insights from './pages/Insights/Insights';
import SentimentAnalysis from './pages/SentimentAnalysis';
import Predictions from './pages/Predictions';
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import SocialInsights from './pages/SocialInsights';
import Support from './pages/Support';
import Dashboard from './pages/components/Dashboard';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || '';

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Routes>
          <Route path="/" element={<><Header /><Home /><Footer /></>} />
          <Route path="/insights" element={
            <SignedIn>
              <Dashboard><Insights /></Dashboard>
            </SignedIn>
          } />
          <Route path="/sentiment" element={
            <SignedIn>
              <Dashboard><SentimentAnalysis /></Dashboard>
            </SignedIn>
          } />
          <Route path="/predictions" element={
            <SignedIn>
              <Dashboard><Predictions /></Dashboard>
            </SignedIn>
          } />
          <Route path="/portfolio" element={
            <SignedIn>
              <Dashboard><PortfolioAnalytics /></Dashboard>
            </SignedIn>
          } />
          <Route path="/social" element={
            <SignedIn>
              <Dashboard><SocialInsights /></Dashboard>
            </SignedIn>
          } />
          <Route path="/support" element={
            <SignedIn>
              <Dashboard><Support /></Dashboard>
            </SignedIn>
          } />
          <Route path="*" element={<SignedOut><RedirectToSignIn /></SignedOut>} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;