import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Join thousands of citizens standing up against corruption. Your voice matters, and together we can create lasting change in Belauri.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#signup"
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Join the Movement
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <a
            href="#reports"
            className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
          >
            Report an Issue
          </a>
        </div>
        <p className="text-sm text-gray-400 mt-8">
          All reports are handled with complete confidentiality and anonymity
        </p>
      </div>
    </section>
  );
}
