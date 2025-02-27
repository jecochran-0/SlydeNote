export default function Description() {
  return (
    <section className="bg-gray-700 text-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto my-12 animate-fade-in">
      <h2 className=" text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-sky-100">
        Welcome to SlydeNote
      </h2>
      <p className="text-s leading-relaxed text-gray-200 ">
        SlydeNote transforms your PowerPoint presentations into simple, easy to
        read academic notes with a single click. My AI-powered tool extracts key
        questions and content, presenting them in a clear, minimalistic format
        that’s perfect for students, or anybody with a lot of PowerPoints.
      </p>
      <p className="text-s leading-relaxed text-gray-200 mt-6 ">
        Could you submit that PowerPoint into ChatGPT instead? Absolutely.
        However other AI models have a bad habit of including analysis, terms,
        or general information that the original PowerPoint never even mentions.
        That's a costly mistake when you're studying for that big exam or giving
        that big presentation. Note that clunky looking PowerPoints or lots of
        images tends to trip up my model a little bit, that's why I give you the
        text straight up if you need to clean it up a little. If not you have
        the option to download it straight as a PDF. Thanks for visiting!
      </p>
    </section>
  );
}
