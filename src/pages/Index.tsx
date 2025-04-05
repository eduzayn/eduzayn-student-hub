
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroBanner from "@/components/home/HeroBanner";
import CategorySection from "@/components/home/CategorySection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import TestimonialSection from "@/components/home/TestimonialSection";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <MainLayout>
      <HeroBanner />
      <CategorySection />
      <FeaturedCourses />
      <FeatureHighlights />
      <TestimonialSection />
      <CallToAction />
    </MainLayout>
  );
};

export default Index;
