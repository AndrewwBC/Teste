const CategoriesRepository = require('../../repositories/CategoriesRepository');

class CategoryController {
  async index(request, response) {
    const category = CategoriesRepository.findAll();

    response.json(category);
  }

  async store(request, response) {
    const { name } = request.body;

    if (!name) {
      return response.status(404).json({ error: 'Name is required!' });
    }

    const category = await CategoriesRepository.create({ name });

    response.json(category);
  }
}

module.exports = new CategoryController();
