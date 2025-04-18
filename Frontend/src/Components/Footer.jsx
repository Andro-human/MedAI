function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-700 text-white py-4 h-[12vh] flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center ">
          <div className="mb-2 md:mb-0">
            <h3 className="text-4xl font-semibold">MedAI</h3>
          </div>

          <div className="text-center md:text-right text-md">
            <p>&copy; {currentYear} MedAI. All rights reserved.</p>
            <p className="text-blue-200 mt-1">
              contact@medai.com | (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
