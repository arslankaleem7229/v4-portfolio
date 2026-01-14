import type { GetStaticProps } from 'next';
import Head from '@components/head';
import { Hero, About, Jobs, Featured, Projects, Contact } from '@components';
import { copyContentAssets, getFeaturedProjects, getJobs, getProjects } from '@lib/content';
import type { FeaturedProject, Job, Project } from '@lib/types';

type HomeProps = {
  jobs: Job[];
  featuredProjects: FeaturedProject[];
  projects: Project[];
};

const HomePage = ({ jobs, featuredProjects, projects }: HomeProps) => (
  <>
    <Head />
    <Hero />
    <About />
    <Jobs jobs={jobs} />
    <Featured projects={featuredProjects} />
    <Projects projects={projects} />
    <Contact />
  </>
);

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  copyContentAssets();

  const [jobs, featuredProjects, projects] = await Promise.all([
    getJobs(),
    getFeaturedProjects(),
    getProjects(true),
  ]);

  return {
    props: {
      jobs,
      featuredProjects,
      projects,
    },
  };
};

export default HomePage;
