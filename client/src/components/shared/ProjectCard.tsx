import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
}

export default function ProjectCard({ title, category, image }: ProjectCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
    >
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <span className="text-accent text-sm font-bold uppercase tracking-wider mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {category}
        </span>
        <h3 className="text-white text-xl font-bold font-heading translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
          {title}
        </h3>
      </div>
    </motion.div>
  );
}
