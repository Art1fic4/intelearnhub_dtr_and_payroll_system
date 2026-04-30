export interface LandingCourseItem {
  code: string;
  name: string;
  description: string;
}

export interface LandingTestimonialItem {
  name: string;
  role: string;
  text: string;
  image: string;
}

export const landingCourses: LandingCourseItem[] = [
  {
    code: "SE102",
    name: "Software Engineering",
    description: "Fundamentals of software development and design patterns",
  },
  { code: "STAT1", name: "Statistics I", description: "Introduction to statistical methods and data analysis" },
  { code: "GV101", name: "Graphic and Visual Computing 101", description: "Introduction to Graphics Design" },
  { code: "DM104", name: "Data Management", description: "Database design and information systems" },
  { code: "SIA101", name: "Systems Integration", description: "Architecture and integration of enterprise systems" },
  { code: "AL102", name: "Algorithm Design", description: "Advanced algorithms and computational theory" },
];

export const landingTestimonials: LandingTestimonialItem[] = [
  {
    name: "Sarah Martinez",
    role: "Software Engineering Graduate",
    text: "The SE102 program transformed my career. The practical approach and expert guidance prepared me perfectly for the industry.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    name: "James Chen",
    role: "Data Management Student",
    text: "Outstanding curriculum and faculty. The hands-on projects in DM104 gave me real-world experience that employers value.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Emily Rodriguez",
    role: "Statistics Graduate",
    text: "The quality of education here is exceptional. STAT1 provided a solid foundation that I continue to build on in my career.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];
