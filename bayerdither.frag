varying vec4 v_color;
varying vec2 v_texCoords;
uniform sampler2D u_texture;


// "steps" of R, G and B. Must be integer && equal or greater than 2
uniform float rcount = 4.0;
uniform float gcount = 4.0;
uniform float bcount = 4.0;
uniform float acount = 1.0;



int bayer[8][8] = {
{ 0,32, 8,40, 2,34,10,42}, // 8x8 bayer ordered dithering
{48,16,56,24,50,18,58,26}, // pattern. Each input pixel
{12,44, 4,36,14,46, 6,38}, // is scaled to the 0..63 range
{60,28,52,20,62,30,54,22}, // before looking in this table
{ 3,35,11,43, 1,33, 9,41}, // to determine the action
{51,19,59,27,49,17,57,25},
{15,47, 7,39,13,45, 5,37},
{63,31,55,23,61,29,53,21} }; // fun fact: you can calculate bayer value on-the-fly but LUT is faster
float bayerSize = 8.0;
/* If you want, you can use 12x12 bayer pattern to improve a quality just a little bit...
int bayer[12][12] = {
{0  ,96 ,64 ,8  ,104,72 ,2  ,98 ,66 ,10 ,106,74 }, // 12x12 bayer ordered dithering
{112,80 ,16 ,120,88 ,24 ,114,82 ,18 ,122,90 ,26 }, // pattern. Each input pixel
{48 ,32 ,128,56 ,40 ,136,50 ,34 ,130,58 ,42 ,138}, // is scaled to the 0..143 range
{12 ,108,76 ,4  ,100,68 ,14 ,110,78 ,6  ,102,70 }, // before looking in this table
{124,92 ,28 ,116,84 ,20 ,126,94 ,30 ,118,86 ,22 }, // to determine the action
{60 ,44 ,140,52 ,36 ,132,62 ,46 ,142,54 ,38 ,134},
{3  ,99 ,67 ,11 ,107,75 ,1  ,97 ,65 ,9  ,105,73 },
{115,83 ,19 ,123,91 ,27 ,113,81 ,17 ,121,89 ,25 },
{51 ,35 ,131,59 ,43 ,139,49 ,33 ,129,57 ,41 ,137},
{15 ,111,79 ,7  ,103,71 ,13 ,109,77 ,5  ,101,69 },
{127,95 ,31 ,119,87 ,23 ,125,93 ,29 ,117,85 ,21 },
{63 ,47 ,143,55 ,39 ,135,61 ,45 ,141,53 ,37 ,133}};
float bayerSize = 12.0;
*/

/*int bayer[7][7] = {
{32,42,10,27,37,5,15},
{1,18,28,45,13,23,40},
{26,36,4,14,31,48,9},
{44,12,22,39,0,17,34},
{20,30,47,8,25,35,3},
{38,6,16,33,43,11,21},
{7,24,41,2,19,29,46}
}; // I kind of accidentally create it...
float bayerSize = 7.0;*/

/*int bayer[14][14] = {
{128,168,40,108,148,20,60,130,170,42,110,150,22,62},
{4,72,112,180,52,92,160,6,74,114,182,54,94,162},
{104,144,16,56,124,192,36,106,146,18,58,126,194,38},
{176,48,88,156,0,68,136,178,50,90,158,2,70,138},
{80,120,188,32,100,140,12,82,122,190,34,102,142,14},
{152,24,64,132,172,44,84,154,26,66,134,174,46,86},
{28,96,164,8,76,116,184,30,98,166,10,78,118,186},
{129,169,41,109,149,21,61,131,171,43,111,151,23,63},
{5,73,113,181,53,93,161,7,75,115,183,55,95,163},
{105,145,17,57,125,193,37,107,147,19,59,127,195,39},
{177,49,89,157,1,69,137,179,51,91,159,3,71,139},
{81,121,189,33,101,141,13,83,123,191,35,103,143,15},
{153,25,65,133,173,45,85,155,27,67,135,175,47,87},
{29,97,165,9,77,117,185,31,99,167,11,79,119,187}
}; // 14 = 7 * 2, and 2x2 bayer is {{0, 2}, {1, 3]}
float bayerSize = 14.0;*/

/*int bayer[21][21] = {
{288,378,90,243,333,45,135,295,385,97,250,340,52,142,291,381,93,246,336,48,138},
{9,162,252,405,117,207,360,16,169,259,412,124,214,367,12,165,255,408,120,210,363},
{234,324,36,126,279,432,81,241,331,43,133,286,439,88,237,327,39,129,282,435,84},
{396,108,198,351,0,153,306,403,115,205,358,7,160,313,399,111,201,354,3,156,309},
{180,270,423,72,225,315,27,187,277,430,79,232,322,34,183,273,426,75,228,318,30},
{342,54,144,297,387,99,189,349,61,151,304,394,106,196,345,57,147,300,390,102,192},
{63,216,369,18,171,261,414,70,223,376,25,178,268,421,66,219,372,21,174,264,417},
{294,384,96,249,339,51,141,293,383,95,248,338,50,140,290,380,92,245,335,47,137},
{15,168,258,411,123,213,366,14,167,257,410,122,212,365,11,164,254,407,119,209,362},
{240,330,42,132,285,438,87,239,329,41,131,284,437,86,236,326,38,128,281,434,83},
{402,114,204,357,6,159,312,401,113,203,356,5,158,311,398,110,200,353,2,155,308},
{186,276,429,78,231,321,33,185,275,428,77,230,320,32,182,272,425,74,227,317,29},
{348,60,150,303,393,105,195,347,59,149,302,392,104,194,344,56,146,299,389,101,191},
{69,222,375,24,177,267,420,68,221,374,23,176,266,419,65,218,371,20,173,263,416},
{292,382,94,247,337,49,139,289,379,91,244,334,46,136,296,386,98,251,341,53,143},
{13,166,256,409,121,211,364,10,163,253,406,118,208,361,17,170,260,413,125,215,368},
{238,328,40,130,283,436,85,235,325,37,127,280,433,82,242,332,44,134,287,440,89},
{400,112,202,355,4,157,310,397,109,199,352,1,154,307,404,116,206,359,8,161,314},
{184,274,427,76,229,319,31,181,271,424,73,226,316,28,188,278,431,80,233,323,35},
{346,58,148,301,391,103,193,343,55,145,298,388,100,190,350,62,152,305,395,107,197},
{67,220,373,22,175,265,418,64,217,370,19,172,262,415,71,224,377,26,179,269,422}
};
float bayerSize = 21.0;*/

float bayerDivider = bayerSize * bayerSize;

vec4 nearestColour(vec4 incolor) {
    vec4 rgbaCounts = vec4(rcount, gcount, bcount, acount);


    vec4 color = incolor;

    color.r = floor((rgbaCounts.r - 1.0) * color.r + 0.5) / (rgbaCounts.r - 1.0);
    color.g = floor((rgbaCounts.g - 1.0) * color.g + 0.5) / (rgbaCounts.g - 1.0);
    color.b = floor((rgbaCounts.b - 1.0) * color.b + 0.5) / (rgbaCounts.b - 1.0);

    if (rgbaCounts.a >= 2.0) {
        color.a = floor((rgbaCounts.a - 1.0) * color.a + 0.5) / (rgbaCounts.a - 1.0);
    }
    else {
        color.a = 1.0;
    }

    return color;
}

void main(void) {
    float spread = 1.0 / (0.299 * (rcount - 1.0) + 0.587 * (gcount - 1.0) + 0.114 * (bcount - 1.0));  // this spread value is optimised one -- try your own values for various effects!


    // create texture coordinates based on pixelSize //
    vec4 inColor = texture2D(u_texture, v_texCoords);

    vec2 entry = mod(gl_FragCoord.xy, vec2(bayerSize, bayerSize));

    gl_FragColor = nearestColour(inColor + spread * (bayer[int(entry.y)][int(entry.x)] / bayerDivider - 0.5));
    //gl_FragColor = nearestColour(inColor);
}
