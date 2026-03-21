import { AlertCircle, Users, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-red-600 bg-opacity-20 border border-red-600 rounded-full mb-6">
            <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
            <span className="text-sm font-medium">Fighting Corruption in Belauri</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-red-600">Transparency</span> is Our Right.<br />
            <span className="text-white">Accountability</span> is Their Duty.
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the youth-led movement demanding integrity, fighting corruption, and building a better future for Belauri Municipality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#reports"
              className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Report Corruption
            </a>
            <a
              href="#about"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-opacity-20 rounded-full mb-4">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">100% Anonymous</h3>
            <p className="text-gray-300">Report corruption safely without revealing your identity</p>
          </div>

          <div className="text-center p-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-opacity-20 rounded-full mb-4">
              <Users className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Youth-Led</h3>
            <p className="text-gray-300">Powered by passionate young citizens of Belauri</p>
          </div>

          <div className="text-center p-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 bg-opacity-20 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Rapid Action</h3>
            <p className="text-gray-300">Community-verified reports drive real change</p>
          </div>
        </div>
      </div>
    </section>
  );
}
