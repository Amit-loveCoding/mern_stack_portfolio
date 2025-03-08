import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Project title is required!"]
  },
  description: {
    type: String,
    required: [true, "Project description is required!"]
  },
  gitRepoLink: {
    type: String,
    required: [true, "GitHub repository link is required!"]
  },
  projectLink: {
    type: String,
    required: [true, "Project link is required!"]
  },
  technologies: {
    type: [String],
    required: [true, "Technologies are required!"]
  },
  stack: {
    type: [String],
    required: [true, "Tech stack is required!"]
  },
  deployed: {
    type: Boolean,
    required: [true, "Deployment status is required!"]
  },
  projectBanner: {
    public_id: {
      type: String,
      required: [true, "Project banner public ID is required!"]
    },
    url: {
      type: String,
      required: [true, "Project banner URL is required!"]
    }
  }
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
