import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      quote: 'Aiterview helped me prepare for my dream job at a tech giant. The feedback was invaluable!',
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      quote: 'The role-specific questions really helped me understand what to expect in my interviews.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      quote: 'I love how the platform provides detailed feedback on my communication style.',
    },
  ];

  return (
    <section id="testimonials" className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          What Our Users Are Saying
        </h2>
        <p className="text-xl text-gray-600">
          Join thousands of successful job seekers who improved their interview skills with Aiterview.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-6">{testimonial.quote}</p>
            <div className="flex items-center space-x-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;