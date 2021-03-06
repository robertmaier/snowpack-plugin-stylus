import stylus from 'stylus';
import * as fs from 'fs';
import * as path from 'path';
import { Options } from '../src/interface';
import { render } from '../src/render';

describe('test src/render.ts', () => {
  it('render(): called with stylus', async () => {
    const spy = jest.spyOn(stylus, 'render');
    const filepath = path.join(__dirname, './fixtures/a.styl');
    const css = fs.readFileSync(filepath, 'utf-8');
    const options: Options = { filename: filepath };

    // mock for test args
    spy.mockImplementation((str, options, cb) => {
      return cb(null, [str, options]);
    });

    expect(spy).not.toBeCalled();
    let args = render(css, options);
    expect(args).toBeInstanceOf(Promise);

    args = await args;
    expect(args).toStrictEqual([css, options]);
    expect(spy).toBeCalledTimes(1);
    spy.mockRestore();

    // test render result
    const result = await render(css, options);
    expect(result.trim()).toStrictEqual(css);
  });
});
