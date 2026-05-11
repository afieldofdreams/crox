import React from 'react';

export const SecondBrainTypedEntitiesPost: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Everyone keeps asking why I'm not using Obsidian.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Fair question. The PM world has converged on it. Beautiful local files, plugin ecosystem, vault portability, the graph view that looks like a constellation when you zoom out. I tried. Twice.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Both times it became a graveyard.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Not because Obsidian is bad. Because the unit it operates on is wrong for how I actually work. Obsidian thinks in notes. Files with backlinks. The graph is emergent decoration on top of unstructured text. Which means everything I capture is shaped like a document, even when it isn't. A meeting is a document. A decision is a document. A person is a document. A project status is a document. The structure lives in folder names and tag conventions I have to enforce by hand, every time, forever.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The thing I needed was the opposite. Typed entities with real fields. A Person has roles and a relationship to a Company. A Decision has a status, a date, an owner, and the options it foreclosed. A Project has a stage, a confidence rating, a horizon, a heat band derived from when I last touched it. None of this is novel database design. It's just refusing to pretend that everything in my head is the same shape.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Fibery gives me that. It is a structured database with{' '}
        <span className="text-fg font-medium">documents living inside the entities, not the other way around</span>
        . I can write a Decision node like a doc, but the Decision also knows it is a Decision, and views, queries, and my AI co-pilot can act on that. A Friday review can ask "what's overdue and important and not touched in two weeks" and get an answer, because importance and last-touched are fields, not vibes I have to remember to tag.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The deeper unlock is that this becomes addressable for AI. My instance of Claude reads from the graph by stable IDs. When I open a session it knows what a Stance is, what the Failure Log is, what's currently in the queue. I don't repaste context. The graph is the context. Obsidian markdown can be parsed, but the model has to infer schema every time. With typed entities the schema is the contract.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The cost is real. Fibery is heavier upfront. I had to think about what kinds of things I'm tracking before I could track them. Obsidian lets you start writing immediately, which is exactly why it ends up as a graveyard. The friction of declaring structure is the same friction that keeps it usable two years in.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        So I'm not anti-Obsidian. I'm anti-flat-file as a model for thinking. If your work is mostly prose and you want fast capture with light retrieval, Obsidian is excellent. If your work is decisions, projects, people, money, and feedback loops that need to compound, you want types and fields, not folders and tags.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        The second brain only earns the name when you can ask it questions it answers itself.
      </blockquote>
    </div>
  );
};
