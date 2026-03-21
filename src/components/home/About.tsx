import { Target, Eye, Heart } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Who We Are
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            BELAURI FIRST is a youth-led social activism platform dedicated to eradicating corruption and promoting transparency in Belauri Municipality, Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <Target className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To create a transparent, accountable, and corruption-free society by empowering citizens to report issues and demand action from authorities.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Eye className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              A Belauri where every citizen has equal access to public services, where corruption is eliminated, and where youth lead the change.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Heart className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-gray-600 leading-relaxed">
              Integrity, transparency, youth empowerment, community participation, and unwavering commitment to justice and accountability.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Why Belauri Needs This Movement
            </h3>
            <div className="text-lg leading-relaxed space-y-4">
              <p>
                Corruption undermines development, perpetuates inequality, and erodes public trust. In Belauri, we've witnessed firsthand how corruption impacts infrastructure projects, public services, and the lives of ordinary citizens.
              </p>
              <p>
                BELAURI FIRST was born from frustration and determination. We refuse to accept the status quo. We believe that by giving citizens a platform to report corruption anonymously and by organizing collective action, we can force accountability and drive real change.
              </p>
              <p className="font-semibold text-xl mt-6">
                Together, we are building a movement that cannot be ignored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
