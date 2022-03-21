import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function TitlebarImageList() {
  return (
    <div>
    <ImageList>
      <ImageListItem key="Subheader" cols={2}>
      </ImageListItem>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            src={`${item.img}?w=248&fit=crop&auto=format`}
            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${item.title}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
    
    
    {/* 컴포넌트 */}
      <div class="w-1/2 bg-white shadow rounded-[20px]">
            {/* 배경화면 */}
            <div className=" h-32 overflow-hidden rounded-t-[20px]" >
                <img className="w-full" src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="" />
            </div>
            <div class=" ">
                <div className="text-center px-14">
                <Link href="/grouppage" underline="none">
                <h2 class="text-gray-800 text-xl font-bold">그룹명</h2> 
                </Link>
                
                
                    
                    <h5 className="text-slate-500 text-sm">멤버 수 : </h5>                               
                </div>
                <hr class="mt-6" />
            </div>
        </div>
    {/* 컴포넌트 */}

    
{/* 메모디자인 1 */}
	<div className="relative py-3 w-1/3">
		<div
			className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
		</div>
		<div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl">
			<div className="max-w-md mx-auto">
				<div>
					<h1 className="text-2xl font-semibold">메모타이틀</h1>
          <h5>메모내용</h5>
				</div>
				<div className="divide-y divide-gray-200">
					<div className=" text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
						
						<div className="relative">
							<button className=" rounded-md mx-3 px-10 py-1"><EditIcon/></button>
              <button className=" rounded-md mx-3 py-1"><DeleteIcon/></button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>


{/* 메모디자인2 */}

  <div className="py-3 w-1/2">
    <div className="bg-amber-300 min-w-1xl flex flex-col rounded-xl shadow-lg">
      <div className="px-12 py-5">
        <h2 className="text-gray-800 text-2xl font-semibold">메모타이틀</h2>
      </div>
      <div className="px-12">
      <h5 className="">메모내용</h5>
      </div>
      <div className="h-20 flex items-center justify-center">
      
          <button className="py-3 w-1/2 mx-3 border-2 border-sky-300 rounded-xl ">수정</button>
          <button className="py-3 w-1/2 mx-3 border-2 border-red-500 rounded-xl ">삭제</button>
      
      </div>
    </div>

  </div>


</div>
    
  );
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: '아침먹기 챌린지!',
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: '햄버거 끊기 모임',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: '사진 동호회',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: '바리스타 자격증 합격자들 모임',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: '모자 디자인',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: '일상생활 꿀빨기 꿀팁',
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: '농구하실분들만',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: '식물 동아리',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: '독버섯에 대한 연구',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: '주말 농장 하실 분만',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: '해양생물 연구소',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: '라이딩 협회',
    cols: 2,
  },
];
