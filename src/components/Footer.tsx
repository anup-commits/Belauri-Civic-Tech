import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-red-600">BELAURI</span> FIRST
            </h3>
            <p className="text-sm leading-relaxed">
              Fighting corruption, empowering youth, and building a transparent future for Belauri Municipality, Nepal.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-red-400 transition-colors">About Us</a></li>
              <li><a href="#reports" className="hover:text-red-400 transition-colors">Submit Report</a></li>
              <li><a href="#news" className="hover:text-red-400 transition-colors">News & Updates</a></li>
              <li><a href="#events" className="hover:text-red-400 transition-colors">Events</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-400" />
                <span className="text-sm">Belauri Municipality, Kanchanpur, Nepal</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0 text-red-400" />
                <span className="text-sm">+977-XXX-XXXXXXX</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0 text-red-400" />
                <span className="text-sm">contact@belaurifirst.org</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm mt-4 leading-relaxed">
              Join our movement for a corruption-free Belauri.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {currentYear} Belauri First. All rights reserved. Fighting for transparency and accountability.
          </p>
        </div>
      </div>
    </footer>
  );
}
