import React from "react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* First Section: Title and Description on Left, Image on Right */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-light mb-8">Who we are!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm md:text-base leading-relaxed text-">
              Discover the best hair care with our shampoo, oil, and hair pack!
              Solve hair fall, dryness, and dandruff with our top-selling
              products. See what customers say and shop by concerns or combos.
              Stay connected for updates, reviews, and exclusive offers. Get
              healthier, shinier hair today – your perfect hair care solution
              awaits!
            </p>
          </div>
          <div className="order-first md:order-last">
            <img
              src="/about.svg"
              alt="Person examining scalp with dandruff"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Second Section: Image on Left, Description on Right */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="/about1.svg"
              alt="Person with damaged hair"
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <p className="text-sm md:text-base leading-relaxed mb-6">
              Struggling with hair fall, dryness, or an itchy scalp? Your hair
              deserves the best, and we bring you a complete solution with our
              Hair Shampoo, Hair Oil, and Hair Pack. Formulated with natural
              ingredients, our products deeply nourish the scalp, strengthen
              hair follicles, and restore lost shine. Whether you're dealing
              with dullness, dandruff, or slow hair growth, our hair care range
              is designed to bring life back to your locks.
            </p>
            <p className="text-sm md:text-base leading-relaxed">
              Everyone's hair is different, and so are their hair problems.
              That's why we offer personalized solutions! Shop by concerns like
              hair fall, frizz control, dandruff treatment, or deep nourishment.
              Looking for the perfect combination? Our expertly curated combos
              provide everything you need for a complete hair care routine. Get
              the best results by choosing products tailored to your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
