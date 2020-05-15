const { userService: service } = require('../services');

const createResource = async (req, res, next) => {
  try {
    const data = await service.createResource(req.body);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const data = await service.getOne(id);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

// /test?array=a&array=b&array=c => array=[a,b,c]
const getProfessors = async (req, res, next) => {
  try {
    const { id } = await req.query;
    if(id === undefined) {
      //return res.json({}); ToDo FUTURE
      return res.json(await service.getMany({})); // mock courses url
    }
    const data = await service.getProfessors(id);

    return res.json(data);
  } catch (error) {
    res.sendStatus(500);
    return next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const data = await service.updateResource(id, req.body);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const updateCourses = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const data = await service.updateResource(id, req.body.course);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const { id } = await req.params;
    const data = await service.deleteResource(id);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createResource,
  getOne,
  getProfessors,
  updateResource,
  updateCourses,
  deleteResource
};
