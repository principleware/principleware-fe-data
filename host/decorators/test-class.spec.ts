import { observableDecorator } from './observable.decorator';

@observableDecorator
export class Test {
    public pageSize: number;
}
