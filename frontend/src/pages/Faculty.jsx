import React from 'react';

const Faculty = () => {
  const teachers = [
    {
      name: 'Dr. John Doe',
      subject: 'Computer Science & Python',
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&auto=format&fit=crop',
      bio: '10+ years teaching programming. PhD in AI.',
    },
    {
      name: 'Sarah Smith',
      subject: 'Web Development & JavaScript',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop',
      bio: 'Full-stack developer, creator of popular JS courses.',
    },
    {
      name: 'Emily Johnson',
      subject: 'UI/UX Design',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop',
      bio: 'Award-winning designer, Figma expert.',
    },
    {
      name: 'Michael Brown',
      subject: 'React & Frontend Frameworks',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
      bio: 'Senior React developer, open-source contributor.',
    },
  ];

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-indigo-700 dark:text-indigo-300">
        Our Faculty
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {teachers.map((teacher, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
          >
            <img
              src={teacher.image}
              alt={teacher.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 dark:text-white">
                {teacher.name}
              </h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                {teacher.subject}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {teacher.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faculty;