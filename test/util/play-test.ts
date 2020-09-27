

describe('ioc-test', () => {

    it("注入类", () => {

        class APP {

            constructor() {

            }
        }

        function controller(target: Function) {

            target.prototype.controller = true;
        };

        let app = new APP();

        var p = new Proxy(function (a:number) {}, {
            construct: function(target, args) {
              console.log('called: ' + args.join(', '));
              return target;
            }
          });

         new p(1);
        

    });
});