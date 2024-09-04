export default class {
    constructor(n)  {
        this.n = n;
        this.sums = Array(n);
        for ( let i = 0; i < n; i ++ )  {
            this.sums[i] = 0;
        }
    }
    add(val)    {
        for ( let i = 0; i < this.n; i ++ )  {
            this.sums[i] += val;
        }
    }
    clear(_i) {
        let i = _i ? _i : 0;
        for ( ; i < this.n; i ++ )  {
            this.sums[i] = 0;
        }
    }
    sum(i)   {
        return  this.sums[i];
    }
}
