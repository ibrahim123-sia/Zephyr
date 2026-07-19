import React, { useState } from "react";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      category: "Orders & Payment",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept JazzCash mobile wallet payments and Cash on Delivery. Choose whichever suits you at checkout.",
        },
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping typically takes 2-4 business days within Pakistan.",
        },
        {
          question: "How do I track my order?",
          answer:
            "Log into your account and visit 'My Orders' to see the current status of every order you've placed.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 14-day return policy for unopened, unused bottles with original packaging intact. Opened bottles are final sale for hygiene reasons.",
        },
        {
          question: "What if my item arrives damaged?",
          answer:
            "Contact us immediately with photos of the damaged item and your order number, and we'll arrange a free replacement or full refund.",
        },
      ],
    },
    {
      category: "Fragrance & Products",
      questions: [
        {
          question: "How do I choose between Eau de Parfum and Eau de Toilette?",
          answer:
            "Eau de Parfum has a higher concentration of fragrance oils and lasts longer on skin. Eau de Toilette is lighter and better for everyday, casual wear.",
        },
        {
          question: "What do 'top, heart, and base notes' mean?",
          answer:
            "Top notes are what you smell first and fade quickly. Heart notes emerge next and form the fragrance's core character. Base notes appear last and linger longest on skin.",
        },
        {
          question: "Are your fragrances tested on skin type?",
          answer:
            "Fragrance develops differently on every skin type. We recommend trying a small amount on your wrist before committing to a full bottle.",
        },
      ],
    },
    {
      category: "Account & Support",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "Click the account icon in the top navigation and select 'Create Account'. You'll verify your email with a one-time code.",
        },
        {
          question: "I forgot my password. How can I reset it?",
          answer:
            "Click 'Login', then 'Forgot Password'. Enter your email and we'll send a reset code valid for a few minutes.",
        },
      ],
    },
  ];

  const allQuestions = faqs.flatMap((category) =>
    category.questions.map((q) => ({ ...q, category: category.category }))
  );

  const filteredQuestions = searchTerm
    ? allQuestions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allQuestions;

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-zephyr-ivory">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl text-zephyr-noir mb-4">Frequently Asked Questions</h1>
        <div className="zephyr-divider mb-6">
          <span className="zephyr-divider-mark"></span>
        </div>
        <p className="text-lg text-zephyr-umber/80 max-w-2xl mx-auto mb-8">
          Find quick answers about orders, shipping, returns, and fragrance.
        </p>

        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 border border-zephyr-sand rounded-sm focus:ring-1 focus:ring-zephyr-gold focus:border-zephyr-gold transition-all bg-white"
          />
        </div>
      </div>

      {searchTerm ? (
        <div className="mb-12">
          <h2 className="font-display text-2xl text-zephyr-noir mb-6">
            Search Results ({filteredQuestions.length})
          </h2>
          <div className="space-y-4">
            {filteredQuestions.map((item, index) => (
              <div key={index} className="bg-white rounded-sm border border-zephyr-sand overflow-hidden">
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-zephyr-ivory transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <div>
                    <span className="text-xs font-medium text-zephyr-gold bg-zephyr-sand/50 px-2 py-1 rounded-sm mb-2 inline-block uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-zephyr-noir text-lg">{item.question}</h3>
                  </div>
                </button>
                {activeIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-zephyr-umber/80 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-zephyr-umber mb-2">No results found</h3>
                <p className="text-zephyr-umber/60">Try different keywords or browse the categories below.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-sm border border-zephyr-sand overflow-hidden">
              <div className="bg-zephyr-sand/40 px-6 py-4 border-b border-zephyr-sand">
                <h2 className="font-display text-xl text-zephyr-noir">{category.category}</h2>
              </div>
              <div className="divide-y divide-zephyr-sand">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 10 + faqIndex;
                  return (
                    <div key={faqIndex} className="transition-colors hover:bg-zephyr-ivory">
                      <button
                        className="w-full px-6 py-5 text-left flex justify-between items-center"
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <h3 className="font-semibold text-zephyr-noir text-lg pr-4">{faq.question}</h3>
                        <span className="text-zephyr-gold flex-shrink-0">
                          {activeIndex === globalIndex ? "−" : "+"}
                        </span>
                      </button>
                      {activeIndex === globalIndex && (
                        <div className="px-6 pb-5">
                          <p className="text-zephyr-umber/80 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-zephyr-noir rounded-sm p-10 text-center text-zephyr-ivory mt-16">
        <h2 className="font-display text-3xl mb-4">Still Need Help?</h2>
        <p className="text-zephyr-ivory/70 mb-8 max-w-2xl mx-auto">
          Can't find what you're looking for? Reach out to our support team directly.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-zephyr-gold text-zephyr-noir px-8 py-3 rounded-sm font-semibold uppercase text-sm tracking-widest hover:bg-zephyr-ivory transition-colors duration-200"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default FAQPage;
