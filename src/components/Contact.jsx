import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null

  // Initialize EmailJS on component mount
  useEffect(() => {
    //EmailJS Public Key from https://dashboard.emailjs.com
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  // Intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("section-hidden");
          entry.target.classList.add("animate-fade-in");
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // EmailJS Service ID and Template ID
      // from https://dashboard.emailjs.com
      await emailjs.sendForm(
        "service_enfp5dq",
        "template_zjq5jia",
        formRef.current
      );

      setStatus("success");
      formRef.current.reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-hidden bg-gray-100" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        
        {/* Status Messages */}
        {status === "success" && (
          <div className="success-message" style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "4px",
            border: "1px solid #c3e6cb",
          }}>
            ✅ Message sent successfully! Thank you for reaching out.
          </div>
        )}
        {status === "error" && (
          <div className="error-message" style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
            border: "1px solid #f5c6cb",
          }}>
            ❌ Failed to send message. Please try again later.
          </div>
        )}

        <form
          ref={formRef}
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Your name" 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@example.com"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Your message here..."
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
