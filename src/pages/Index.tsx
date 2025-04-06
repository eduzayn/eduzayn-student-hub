
import React from "react";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import CategorySection from "@/components/home/CategorySection";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import TestimonialSection from "@/components/home/TestimonialSection";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <>
      <HeroBanner />
      <FeaturedCourses />
      <CategorySection />
      <FeatureHighlights />
      <TestimonialSection />
      <CallToAction />
    </>
  );
};

export default Index;
