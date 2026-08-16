import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Contact Support</h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Have queries about class timings, notes access, or registration packages? Send a message and we'll reply as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Details Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-8">
            <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Get In Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-500/10 text-primary-400 rounded-xl border border-primary-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Email Address</h3>
                  <p className="text-sm text-slate-400 mt-1">support@physicsacademy.com</p>
                  <p className="text-xs text-slate-500 mt-0.5">We respond within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Phone Support</h3>
                  <p className="text-sm text-slate-400 mt-1">+91 98765 43210</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mon - Sat, 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Main Office</h3>
                  <p className="text-sm text-slate-400 mt-1">Sector 17, Educational Hub,</p>
                  <p className="text-xs text-slate-500 mt-0.5">Chandigarh, India</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form Panel */}
        <div className="lg:col-span-7">
          <Card className="p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2.5 uppercase tracking-wide">
              <MessageSquare className="w-5 h-5 text-primary-400" />
              <span>Send Message</span>
            </h2>

            {submitted && (
              <Alert variant="success" onClose={() => setSubmitted(false)}>
                Thank you! Your message was submitted successfully. Our support team will get in touch with you shortly.
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />

              <Input
                label="Your Message"
                type="textarea"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail your question here..."
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={Send}
                className="w-full sm:w-fit rounded-full text-xs font-bold"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
