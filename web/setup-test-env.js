import { jsdom } from 'jsdom';
import 'enzyme';

// Mock a global document (for enzyme.mount()).
global.window = global;
window.document = jsdom();
