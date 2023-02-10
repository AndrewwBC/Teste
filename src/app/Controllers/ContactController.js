const ContactsRepository = require('../../repositories/ContactRepository');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;
    const contacts = await ContactsRepository.findAll(orderBy);
    response.json(contacts);
  }
  async show(request, response) {
    const { id } = request.params;
    const contact = await ContactsRepository.findById(id);

    if (!contact) response.status(404).json({ error: 'User not found' });

    response.json(contact);
  }
  async store(request, response) {
    const { name, email, phone, category_id } = request.body;

    const contactExist = await ContactsRepository.findByEmail(email);

    if (!name) response.status(404).json({ error: 'Name is required!' });

    if (contactExist)
      response.status(404).json({ error: 'Email is already in use' });

    const contact = await ContactsRepository.createContact({
      name,
      email,
      phone,
      category_id,
    });
    response.json(contact);
  }

  async update(request, response) {
    const { id } = request.params;
    const { name, email, phone, category_id } = request.body;

    const contactExists = await ContactsRepository.findById(id);

    if (!contactExists) response.status(404).json({ error: 'User not found' });

    const contactByEmail = await ContactsRepository.findByEmail(email);

    if (!name) response.status(404).json({ error: 'Name is required!' });

    if (contactByEmail && contactByEmail.id !== id)
      response.status(404).json({ error: 'Email is already in use' });

    const contact = await ContactsRepository.update(id, {
      name,
      email,
      phone,
      category_id,
    });
    response.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;

    await ContactsRepository.deleteUser(id);
    response.sendStatus(204);
  }
}

module.exports = new ContactController();
