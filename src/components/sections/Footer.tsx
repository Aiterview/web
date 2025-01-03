import { 
  BrainCog, 
  //Twitter, 
  Linkedin, 
  //Github 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BrainCog className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-800">Aiterview</span>
            </div>
            <p className="text-gray-600">
              Practice your interview skills and get better at landing your dream job.
            </p>
            <div className="flex space-x-4">
              {/* <SocialLink href="#" icon={Twitter} /> */}
              <SocialLink href="#" icon={Linkedin} />
              {/* <SocialLink href="#" icon={Github} /> */}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Product</h3>
            <FooterLinks
              links={['Features', 'How It Works', 'Pricing', 'Enterprise']}
            />
          </div>

          {/* <div>
            <h3 className="font-semibold text-gray-800 mb-4">Resources</h3>
            <FooterLinks
              links={['Blog', 'Help Center', 'Documentation', 'API']}
            />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
            <FooterLinks
              links={['About', 'Careers', 'Contact', 'Press']}
            />
          </div> */}
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 Aiterview. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocialLink = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <a
    href={href}
    className="text-gray-400 hover:text-indigo-600 transition-colors"
  >
    <Icon className="h-5 w-5" />
  </a>
);

const FooterLinks = ({ links }: { links: string[] }) => (
  <ul className="space-y-2">
    {links.map((link) => (
      <li key={link}>
        <a
          href="#"
          className="text-gray-600 hover:text-indigo-600 transition-colors"
        >
          {link}
        </a>
      </li>
    ))}
  </ul>
);

export default Footer;