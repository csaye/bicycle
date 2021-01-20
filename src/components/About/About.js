import './About.css';

function About() {
  return (
    <div className="About Form shadowed flex-col">
      {/* Title */}
      <h1>About Bicycle</h1>
      <p className="tagline">
      A minimalist social media placing its users first.
      Post thoughts, connect with friends, and keep it simple on Bicycle.
      </p>
      <hr />
      {/* Quote */}
      <h2 className="text-center font-italic">
      “No one got upset when bicycles showed up.
      </h2>
      <p className="text-center font-italic">
      If something is a tool, it genuinely is just sitting there,
      waiting patiently. If something is not a tool, it’s demanding
      things from you...That’s what’s
      changed. Social media isn’t a tool that’s just waiting to be
      used. It has its own goals, and it has its own means of pursuing
      them by using your psychology against you.”
      </p>
      <p>- Tristan Harris (HumaneTech co-founder)</p>
      <hr />
      <p className="text-center">
      Bicycle was founded on the principles of privacy, safety, and simplicity.
      Our aim is to leave behind all that hinders modern social media —
      data collection, targeted advertisements, and number-focused engagement —
      and provide a way for people to just share their thoughts and connect.
      </p>
      <p>Thank you for using Bicycle.</p>
      <hr />
      {/* GitHub */}
      <p className="text-center">
      Bicycle is 100% open source.
      <br />
      Have an issue? Want to contribute? Find our GitHub here:
      <br />
      <a
      href="https://github.com/csaye/bicycle"
      target="_blank"
      rel="noreferrer">
      Bicycle GitHub
      </a>
      </p>
    </div>
  );
}

export default About;
