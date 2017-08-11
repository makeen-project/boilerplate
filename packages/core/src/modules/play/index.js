import Joi from 'joi';
import { Module } from 'makeen';
import router from './router';

class Play extends Module {
  hooks = {
    'router:load': () => {},
  };

  // eslint-disable-next-line class-methods-use-this
  createProductResource({ generateRESTRouter, createRepository, addRouter }) {
    const ProductRepository = createRepository({
      name: 'Product',
      schema: {
        _id: Joi.object(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
      },
    });

    const productRouter = generateRESTRouter({
      repository: ProductRepository,
    });

    addRouter('/products', 'productRouter', productRouter);
  }

  async setup() {
    const [
      { jwtMiddleware },
      { generateRESTRouter, addRouter },
      { createRepository },
    ] = await this.dependencies(['user', 'router', 'mongoDb']);

    addRouter('playRouter', router({ jwtMiddleware }));

    this.createProductResource({
      generateRESTRouter,
      createRepository,
      addRouter,
    });
  }
}

export default Play;
