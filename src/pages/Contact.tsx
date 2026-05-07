import { useState } from "react";
import Layout from "@/components/Layout";
import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import { Mail, Phone, MapPin, Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEmail } from "@/hooks/useEmail";
import { useDrive } from "@/hooks/useDrive";
import useSiteContent from "@/hooks/useSiteContent";
import { localBusinessSchema, breadcrumbSchema } from "@/utils/structuredData";

const Contact = () => {
  const { t } = useLanguage();
  const { content } = useSiteContent();
  const contactEmail = content.footer_email || content.contact_email || "info@jadtraconsulting.com";
  const contactPhone = content.footer_phone || content.contact_phone || "+62 21 0000 0000";
  const contactAddress = content.footer_location || content.footer_address || content.contact_address || "Jakarta, Indonesia";
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<{fileName: string, webViewLink: string}[]>([]);
  
  const { sendContactForm, loading, error, success, reset: resetEmail } = useEmail();
  const { uploadFile, loading: uploadLoading, error: uploadError } = useDrive();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...attachedFiles, ...files];
    setAttachedFiles(newFiles);

    // Upload files to Google Drive
    for (const file of files) {
      const result = await uploadFile(file);
      if (result) {
        setUploadResults(prev => [...prev, { fileName: file.name, webViewLink: result.webViewLink }]);
      }
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      ...form,
      attachments: uploadResults.map(result => `${result.fileName}: ${result.webViewLink}`).join('\n')
    };

    await sendContactForm(formData);
    
    if (success) {
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
      setAttachedFiles([]);
      setUploadResults([]);
      setTimeout(() => resetEmail(), 5000);
    }
  };

  const structuredData = {
    ...localBusinessSchema,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactPhone,
      contactType: 'customer service',
      availableLanguage: ['English', 'Indonesian'],
      email: contactEmail,
    },
  };

  const breadcrumbs = [
    { name: 'Home', url: 'https://jadtraconsulting.com' },
    { name: t("contact.title"), url: 'https://jadtraconsulting.com/contact' },
  ];

  return (
    <>
      <SEO 
        title={t("contact.title")}
        description="Contact JADTRA Consulting for professional business consulting, tax advisory, and digital transformation services. Get in touch with our expert team."
        keywords="contact JADTRA Consulting, business consulting contact, tax advisory contact, Jakarta Indonesia"
        canonical="https://jadtraconsulting.com/contact"
        structuredData={structuredData}
      />
      <Layout>
      <section className="section-padding">
        <div className="container-narrow">
          <FadeIn>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">{t("contact.title")}</h1>
              <div className="gold-divider mt-4 mx-auto" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-secondary section-padding">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <FadeIn>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t("contact.form.title")}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t("contact.form.name")}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t("contact.form.email")}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t("contact.form.phone") || "Phone"}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t("contact.form.company") || "Company"}</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t("contact.form.message")}</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t("contact.form.attachments") || "Attachments"}</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 dark:hover:border-primary/60 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      disabled={uploadLoading}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="text-muted-foreground" size={24} />
                      <span className="text-sm text-muted-foreground">
                        {uploadLoading ? "Uploading..." : "Click to upload files or drag and drop"}
                      </span>
                      <span className="text-xs text-muted-foreground">PDF, DOC, DOCX, XLS, XLSX (MAX. 10MB)</span>
                    </label>
                  </div>
                  
                  {attachedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-primary" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Status Messages */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded">
                    <AlertCircle size={16} className="text-destructive" />
                    <span className="text-sm text-destructive">{error}</span>
                  </div>
                )}
                
                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded">
                    <AlertCircle size={16} className="text-destructive" />
                    <span className="text-sm text-destructive">File upload error: {uploadError}</span>
                  </div>
                )}
                
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded">
                    <CheckCircle size={16} className="text-primary" />
                    <span className="text-sm text-primary">{t("contact.form.success")}</span>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || uploadLoading}
                  className="px-8 py-3.5 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : t("contact.form.submit")}
                </button>
              </form>
            </FadeIn>

            <FadeIn delay={0.15}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{t("contact.office.title")}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-primary mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("contact.office.email")}</p>
                    <p className="text-sm text-muted-foreground">{contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-primary mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("contact.office.phone")}</p>
                    <p className="text-sm text-muted-foreground">{contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary mt-0.5" size={20} strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("contact.office.address")}</p>
                    <p className="text-sm text-muted-foreground">{contactAddress}</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 w-full h-48 bg-muted border border-border flex items-center justify-center">
                <span className="text-sm text-muted-foreground">{t("contact.office.map")}</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      </Layout>
    </>
  );
};

export default Contact;
