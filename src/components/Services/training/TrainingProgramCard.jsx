// TrainingProgramCard.jsx
import React from "react";
import SEO from "../../SEO";

const TrainingProgramCard = ({ program, index, onClick }) => {
  return (
    <>
      <SEO
        title={`Bellatrix Training Program | ${
          program.title || "ERP Training Course"
        }`}
        description={`${
          program.title || "Bellatrix training program"
        }: ${(
          program.shortDescription || program.description || "Professional ERP training course"
        ).substring(0, 120)}... Expert-led Bellatrix education.`}
        keywords={`NetSuite training program, ${
          program.title || "ERP training"
        }, Oracle training course, NetSuite education, ERP certification program`}
        ogTitle={`NetSuite Training Program - ${
          program.title || "Oracle ERP Education"
        }`}
        ogDescription={`Enroll in ${
          program.title || "Bellatrix training program"
        }. ${(program.shortDescription || program.description || "").substring(
          0,
          100
        )}... Professional ERP education.`}
        ogImage="/images/netsuite-training-program.jpg"
      />
      <article
        onClick={onClick}
        className="text-center p-5 bg-white rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group transform hover:scale-105"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {program.title || "Bellatrix Training Program"}
        </h3>
        <p className="text-sm text-gray-600">
          {program.shortDescription || program.description ||
            "Professional Bellatrix training course"}
        </p>
      </article>
    </>
  );
};

export default TrainingProgramCard;
